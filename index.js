import { useCallback, useState, useDebugValue } from "react";

export const patterns = {
  email:
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
  noSpecialChar: /^[a-zA-Z]+\.[a-zA-Z]{4,10}^/,
  noSpace: /\s/g,
  onlyNumber: /^[0-9]*$/,
  onlyString: /^[a-zA-Z_ ]*$/,
};

export function useForm({ validations, initialValues = {} }) {
  useDebugValue("@kaydhiman/react-hook-useform");

  if (!validations) {
    throw new Error("the option `validations` is required");
  }

  if (typeof validations !== "object") {
    throw new Error("the option `validations` should be an object");
  }

  if (typeof initialValues !== "object") {
    throw new Error("the option `initialValues` should be an object");
  }

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const setInitialValues = useCallback(
    (newValues) => {
      setValues(newValues);
    },
    [setValues]
  );

  function validateField(name, value = "") {
    // get the validation rules for the field
    const rules = validations[name];

    if (
      value === null ||
      value === "null" ||
      value === undefined ||
      value === "undefined"
    ) {
      setValues((state) => ({
        ...state,
        [name]: "",
      }));
      return true;
    }

    // check if the rules exist, since a field can not have validations
    if (rules) {
      // if the required rule is registered
      if (rules.required) {
        // now we validate the value checking if it has a value
        // we are using trim, to strip white spaces before and after the value
        if (typeof value === "string") {
          if (!value.trim()) {
            return typeof rules.required === "string"
              ? rules.required
              : "This field is Required";
          }
        }
      }

      // if the pattern rule is registered
      if (rules.pattern) {
        // we execute the regex
        if (!new RegExp(rules.pattern.value).exec(value)) {
          // if the value does not match with the regex pattern, we try to return
          // the custom message and fallback to the default message in case
          return rules.pattern.message || "Invalid value";
        }
      }

      // if the minLength rule is registered
      if (rules.minLength) {
        // we check length of value
        if (value.length < rules.minLength.value) {
          // if the value less then minLength, we try to return
          // the custom message and fallback to the default message in case
          return (
            rules.minLength.message ||
            `Value should be minimum ${rules.minLength.value} characters`
          );
        }
      }

      // if the maxLength rule is registered
      if (rules.maxLength) {
        // we check length of value
        if (value.length > rules.maxLength.value) {
          // if the value more then maxLength, we try to return
          // the custom message and fallback to the default message in case
          return (
            rules.maxLength.message ||
            `Value should be maximum ${rules.maxLength.value} characters`
          );
        }
      }

      // if it has a validation function and its type is a function
      if (rules.validate && typeof rules.validate === "function") {
        // we run the validate function with the field value
        const error = rules.validate(value);

        // if an error message was returned, we return it
        if (error) {
          return error;
        }
      }
    }

    // if there are no erros, we return an empty string
    return "";
  }

  function bindField(name) {
    if (!name) {
      throw new Error("The field name parameter is required");
    }

    if (name && typeof name !== "string") {
      throw new Error("The field name should be a string");
    }

    return {
      value: values[name] || "",
      onChange: (e) => {
        const { value } = e.target;

        setValues((state) => ({
          ...state,
          [name]: value,
        }));

        setErrors((state) => ({
          ...state,
          [name]: validateField(name, value),
        }));
      },
    };
  }

  function isValid() {
    const hasErrors = Object.keys(validations).some((name) =>
      Boolean(validateField(name, values[name]))
    );

    return !hasErrors;
  }

  return {
    values,
    errors,
    bindField,
    isValid,
    setInitialValues,
  };
}