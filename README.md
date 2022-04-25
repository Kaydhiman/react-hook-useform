# React hook useForm

Validate your ReactJS input elements.

# Installation

`npm i @kaydhiman/react-hook-useform --save`

# Demo

[Live Demo](https://stackblitz.com/edit/react-d8am87)
# Basic Usage

Import and invoke the useForm hook in your React JS component.
It will return a object `{ values, errors, bindField, isValid, setInitialValues, checkErrors }`

```
import React, { useEffect } from "react";
import { useForm, patterns } from "@kaydhiman/react-hook-useform";

export function Form() {
  const { values, errors, bindField, isValid, setInitialValues, checkErrors } = useForm({
    validations: {
      email: {
        pattern: {
          value: patterns.email,
          message: 'Please enter valid email address.',
        },
        required: true,
      },
      password: {
        minLength: 6,
        required: true,
      },
    },
  });

  // Submitting form useForm values 
  const formSubmitHandler = (e) => {
    e.preventDefault();

    fetch('https://yourPathToPostData', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_email: values.email, user_password: values.password }),
      // Tip: You can also use same keys to useForm validations that you can send in API payload, to right less code i.e. 
      // body: JSON.stringify(values)
    });
  };

  return (
    <form onSubmit={formSubmitHandler}>
      <label htmlFor="email">Enter your email</label>
      <input type="email" name="email" id="email" {...bindField('email')} />
      {errors.email && <p>{errors.email}</p>}
      <label htmlFor="password">Enter your password</label>
      <input
        type="password"
        name="password"
        id="password"
        {...bindField('password')}
      />
      {errors.password && <p>{errors.password}</p>}
      <button type="submit" disabled={!isValid()}>
        Submit
      </button>
    </form>
  );
}

```

# setInitialValues Usage

```
  useEffect(() => {
    // GET API call..
    // Suppose we get an Object in response.
    const response = { name: 'My name', password: 123456 };

    setInitialValues(response);
  }, []);
```

# checkErrors Usage

```
  // Before Submit form check if there is some errors...
    const formSubmitHandler = (e) => {
    e.preventDefault();

    // just invoke checkErrors function and that's it!
    if(checkErrors()) {
      return;
    }

    fetch('https://yourPathToPostData', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    });
  };
```

# APIs
useForm return a Object that contains following keys and values.
| Key | Type | Usage |
| ------ | ------ | ------ |
| values | Object | values used for getting all values from useForm hook. |
| errors | Object | errors used for getting all erros of validations from useForm hook. |
| bindField | Function | bindField used for bind value and onChange event on input fields. |
| isValid | Function | isValid used for checking if all binded fields are valid as per validations that we created in useForm hook. |
| setInitialValues | Function | setInitialValues used to set initial values of input fields that bind with bindField. |
| checkErrors | Function | checkErrors used for check if there is any error and it will return a object of errors. |
