import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceQueryParams } from "../../helpers/helpers";

const Filter = () => {

     const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    const navigate = useNavigate();
    let [searchParams] = useSearchParams();


    // Handle price filter 
    const handleButtonClick = (e) => {
        e.preventDefault();

        const validatedMin = min ? min : 0;
        const validatedMax = max ? max : 0;

        // Crée une nouvelle instance avec les deux paramètres
        let updatedParams = getPriceQueryParams(searchParams, "min", validatedMin);
        updatedParams = getPriceQueryParams(updatedParams, "max", validatedMax);
        console.log("Navigating to: ", updatedParams.toString());
        // Utilise bien updatedParams ici, pas searchParams
        navigate({
            pathname: window.location.pathname,
            search: updatedParams.toString(),
        });
    };
    
    
    return (
         <div className="border p-3 filter">
      <h3>Filters</h3>
      <hr />
      <h5 className="filter-heading mb-3">Price</h5>
      <form
        id="filter_form"
        className="px-2"
        onSubmit={handleButtonClick}
      >
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Min ($)"
              name="min"
              value={min} 
              onChange={(e) => setMin(e.target.value ? Number(e.target.value) : 0)} // Fallback to 0 if input is empty
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Max ($)"
              name="max"
              value={max}
              onChange={(e) => setMax(e.target.value ? Number(e.target.value) : 0)} // Fallback to 0 if input is empty
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">GO</button>
          </div>
        </div>
      </form>
      <hr />
      <h5 className="mb-3">Category</h5>

      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          name="category"
          id="check4"
          value="Category 1"
        />
        <label className="form-check-label" for="check4"> Category 1 </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          name="category"
          id="check5"
          value="Category 2"
        />
        <label className="form-check-label" for="check5"> Category 2 </label>
      </div>

      <hr />
      <h5 className="mb-3">Ratings</h5>

      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          name="ratings"
          id="check7"
          value="5"
        />
        <label className="form-check-label" for="check7">
          <span className="star-rating">★ ★ ★ ★ ★</span>
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          name="ratings"
          id="check8"
          value="4"
        />
        <label className="form-check-label" for="check8">
          <span className="star-rating">★ ★ ★ ★ ☆</span>
        </label>
      </div>
    </div>
    )
}

export default Filter;

