# React hook useForm

Validate your ReactJS input elements.

# Installation

`npm i @kaydhiman/react-hook-useform --save`

# Usage
Then import it in your React JS component and invoke the useForm hook. 
It will return a object `{ values, errors, bindField, isValid, setInitialValues }`

```
import React, { useEffect } from "react";
import { useForm, patterns } from "@kaydhiman/react-hook-useform";

export function Form() {
  const { values, errors, bindField, isValid, setInitialValues } = useForm({
      validations: {
      email: { pattern: patterns.email, required: true },
      password: { minLength: 6, required: true },
    },
    {}
  });

  useEffect(() => {
    // GET API call..
    // Suppose we get an Object in response.
    const response = { name: "My name", password: 123456 };

    setInitialValues(response);
  }, []);

  const formSubmitHandler = () => {
    fetch("https://yourPathToPostData", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: { user_email: values.email, user_password: values.password },
    });
  };

  return (
    <form onSubmit={formSubmitHandler}>
      <input type="email" name="email" {...bindField("email")} />
      {errors.email && <p>{errors.email}</p>}
      <input type="password" name="password" {...bindField("password")} />
      {errors.password && <p>{errors.password}</p>}
      <button type="submit" disabled={isValid()}>
        Submit
      </button>
    </form>
  );
} 

```
