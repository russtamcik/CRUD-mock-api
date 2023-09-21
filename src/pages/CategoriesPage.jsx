import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import request, { sort } from "../server";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const productSchema = yup
  .object({
    name: yup.string().required("Please fill!"),
    email: yup.string().required("Please fill!"),
    image: yup.string().url().required("Please fill!"),
    price: yup.string().required("Please fill!"),
  })
  .required();

const CategoriesPage = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
  });

  useEffect(() => {
    getData();
  }, [id]);

  async function getData() {
    try {
      const response = await request.get(`/products/${id}/category`);
      setPosts(response.data);
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
        await request.post(`/products/${id}/category`, data);
      } else {
        await request.put(`/products/${id}/category/${selected}`, data);
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
      const { data } = await request.get(
        `/products/${id}/category/${selected}`
      );
      reset(data);
    } catch (error) {
      toast.error("Error");
    }
  };

  const deleteData = async (id) => {
    confirm("Are you sure you want to delete?");
    try {
      await request.delete(`/products/${id}/category/${id}`);
      getData();
    } catch (error) {
      toast.error("Error");
    }
  };

  console.log(errors);
  return (
    <div className="container">
      <div className="input-group my-3">
        <input
          type="text"
          className="form-control"
          placeholder="Searching..."
        />
        <span className="input-group-text">{posts.length}</span>
        <Form.Select>
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
        {posts.map((el) => (
          <div
            key={el.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 mx-auto my-3"
          >
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
              </div>
            </div>
          </div>
        ))}
      </div>
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
                type="text"
                id="price"
                className="form-control"
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="image">Image URL</label>
              <input
                {...register("image")}
                type="text"
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

export default CategoriesPage;
