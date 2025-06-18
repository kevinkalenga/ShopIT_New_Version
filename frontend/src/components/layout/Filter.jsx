import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceQueryParams } from "../../helpers/helpers";
import { PRODUCT_CATEGORIE } from '../../constants/constants';

const Filter = () => {

     const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    const navigate = useNavigate();
    let [searchParams] = useSearchParams();

    
      useEffect(() => {
        if (searchParams.has('min')) {
            setMin(Number(searchParams.get('min')));
        } else {
            setMin(0);
        }

        if (searchParams.has('max')) {
            setMax(Number(searchParams.get('max')));
        } else {
            setMax(0);
        }
    }, [searchParams]); // ✅ Re-exécute si l’URL change
    
    
    
    
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
    
    
    const handleClick = (checkbox) => {
        const updatedParams = new URLSearchParams(searchParams);

        // Un seul checkbox actif par groupe
        const checkboxes = document.getElementsByName(checkbox.name);
        checkboxes.forEach((item) => {
            if (item !== checkbox) item.checked = false;
        });

        if (checkbox.checked) {
            updatedParams.set(checkbox.name, checkbox.value);
        } else {
            updatedParams.delete(checkbox.name);
        }

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

        {
                PRODUCT_CATEGORIE?.map((category) => (


                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name="category"
                            id={`check_${category}`}
                            value={category}
                            checked={searchParams.get("category") === category}
                            onClick={(e) => handleClick(e.target)}
                        />
                        <label className="form-check-label" htmlFor="check4"> {category} </label>
                    </div>



                ))
            }




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

