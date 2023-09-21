import { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import request, { sort } from "../server";

const productSchema = yup
  .object({
    name: yup.string().required("Please fill!"),
    email: yup.string().required("Please fill!"),
    image: yup.string().url().required("Please fill!"),
    price: yup.string().required("Please fill!"),
  })
  .required();

const ProductsPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
  });

  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPage] = useState(10);
  const [selectedSort, setSelectedSort] = useState("");

  useEffect(() => {
    getData();
  }, [searchQuery, currentPage, itemsPage, selectedSort]);

  async function getData() {
    try {
      let { data } = await request.get("products", {
        params: {
          search: searchQuery,
          _page: currentPage,
          _limit: itemsPage,
          _sort: selectedSort,
        },
      });
      setData(data);
    } catch (err) {
      console.log(err);
    }
  }

  const closeModal = () => setShow(false);

  const openModal = () => {
    setSelected(null);
    setShow(true);
    reset({ name: "", email: "", image: "", price: "" });
  };

  const onSubmit = async (data) => {
    try {
      if (selected === null) {
        await request.post("products", data);
      } else {
        await request.put(`products/${selected}`, data);
      }
      getData();
      closeModal();
    } catch (error) {
      toast.error("Error");
    }
  };

  const editData = async (id) => {
    try {
      setShow(true);
      setSelected(id);
      let {
        data: { name, email, image, price },
      } = await request.get(`products/${id}`);
      reset({ name, email, image, price });
    } catch (error) {
      toast.error("Error");
    }
  };

  const deleteData = async (id) => {
    confirm("Are you sure you want to delete?");
    try {
      await request.delete(`products/${id}`);
      getData();
    } catch (error) {
      toast.error("Error");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(data.length / itemsPage);

  const startIndex = (currentPage - 1) * itemsPage;
  const endIndex = startIndex + itemsPage;
  const displayedData = data.slice(startIndex, endIndex);

  console.log(errors);

  return (
    <div className="container">
      <div className="input-group my-3">
        <input
          type="text"
          className="form-control"
          placeholder="Searching..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <span className="input-group-text">{data.length}</span>
        <Form.Select onChange={(e) => setSelectedSort(e.target.value)}>
          {sort.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Form.Select>
        <button
          onClick={openModal}
          className="btn btn-outline-secondary"
          type="button"
        >
          Add
        </button>
      </div>
      <div className="categories-row row">
        {displayedData.map((el) => (
          <div key={el.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="card">
              <img src={el.image} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">{el.name}</h5>
                <p>{el.email}</p>
                <p>Price: {el.price}</p>
                <Button
                  onClick={() => editData(el.id)}
                  className="me-2"
                  variant="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteData(el.id)}
                  className="me-2"
                  variant="danger"
                >
                  Delete
                </Button>
                <Link to={`/categories/${el.id}`} className="btn btn-warning">
                  See products {el.id}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ul className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
      <Modal show={show} onHide={closeModal}>
        <form onSubmit={handleSubmit(onSubmit)} className="container mt-4">
          <Modal.Header closeButton>
            <Modal.Title>Category data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group mb-3">
              <label htmlFor="name">Name</label>
              <input
                {...register("name")}
                type="text"
                id="name"
                className="form-control"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="form-control"
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="price">Price</label>
              <input
                {...register("price")}
                type="number"
                id="price"
                className="form-control"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="image">Image </label>
              <input
                {...register("image")}
                type="url"
                id="image"
                className="form-control"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button type="submit" variant="primary" onClick={closeModal}>
              {selected ? "Save" : "Add"} category
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
