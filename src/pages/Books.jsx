import { useEffect, useState } from "react";
import api from "../api/axios";

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get("/books?_expand=author&_expand=category&_expand=publisher")
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Danh sách sách</h1>
      <table>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Thể loại</th>
            <th>NXB</th>
            <th>Số lượng</th>
            <th>Còn lại</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td><img src={book.image} width={50} alt={book.title} /></td>
              <td>{book.title}</td>
              <td>{book.author?.name}</td>
              <td>{book.category?.name}</td>
              <td>{book.publisher?.name}</td>
              <td>{book.quantity}</td>
              <td>{book.available}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Books;
