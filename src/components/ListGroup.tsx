import { useState } from "react";

function ListGroup() {
  let items = ["New York", "San Franciso", "Tokyo", "London", "Paris"];
  let selectedIndex = 0; //no item selected
  // Hook
  useState;

  const handleClick = (event: MouseEvent) => console.log(event);
  return (
    <>
      <h1> List</h1>
      {items.length === 0 && <p>No item found</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
