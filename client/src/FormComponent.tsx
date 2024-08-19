// FormComponent.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";

interface FormData {
  name: string;
  date: string;
  hours: number;
}

const FormComponent: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    date: new Date().toISOString().substring(0, 10),
    hours: 0,
  });

  const mutation = useMutation<void, Error, FormData>((newData) => {
    return fetch("/api/daily", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    });
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="date"
          >
            Date:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="hours"
          >
            Hours:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            name="hours"
            id="hours"
            value={formData.hours}
            onChange={handleChangeNumber}
            required
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>

        {mutation.isLoading && <p>Submitting...</p>}
        {mutation.isError && (
          <p>Error submitting the form: {mutation.error?.message}</p>
        )}
        {mutation.isSuccess && <p>Form submitted successfully!</p>}
      </form>
    </div>
  );
};

export default FormComponent;
