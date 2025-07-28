import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";
import { CustomFormField } from "./FormField";

const MockForm = ({ children }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("CustomFormField Component", () => {
  // Test for text input
  it("renders a text input field", () => {
    render(
      <MockForm>
        <CustomFormField name="testText" label="Test Text" type="text" />
      </MockForm>
    );

    const input = screen.getByLabelText(/Test Text/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  // Test for email input
  it("renders an email input field", () => {
    render(
      <MockForm>
        <CustomFormField name="testEmail" label="Test Email" type="email" />
      </MockForm>
    );

    const input = screen.getByLabelText(/Test Email/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
  });

  // Test for textarea
  it("renders a textarea field", () => {
    render(
      <MockForm>
        <CustomFormField name="testTextarea" label="Test Textarea" type="textarea" />
      </MockForm>
    );

    const textarea = screen.getByPlaceholderText(/Test Textarea/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("rows", "3");
  });

  // Test for select input
  it("renders a select field", () => {
    render(
      <MockForm>
        <CustomFormField
          name="testSelect"
          label="Test Select"
          type="select"
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ]}
        />
      </MockForm>
    );

    const select = screen.getByLabelText(/Test Select/i);
    expect(select).toBeInTheDocument();
    fireEvent.change(select, { target: { value: "option1" } });
    expect(select.value).toBe("option1");
  });

  // Test for switch input
  it("renders a switch field", () => {
    render(
      <MockForm>
        <CustomFormField name="testSwitch" label="Test Switch" type="switch" />
      </MockForm>
    );

    const switchInput = screen.getByLabelText(/Test Switch/i);
    expect(switchInput).toBeInTheDocument();
    fireEvent.click(switchInput);
    expect(switchInput).toBeChecked();
  });

  // Test for file input
  it("renders a file input field", () => {
    render(
      <MockForm>
        <CustomFormField name="testFile" label="Test File" type="file" />
      </MockForm>
    );

    const fileInput = screen.getByLabelText(/Test File/i);
    expect(fileInput).toBeInTheDocument();
    // Note: The FilePond component will require a custom test setup to simulate file uploads.
  });

  // Test for number input
  it("renders a number input field", () => {
    render(
      <MockForm>
        <CustomFormField name="testNumber" label="Test Number" type="number" />
      </MockForm>
    );

    const input = screen.getByLabelText(/Test Number/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "number");
  });

  // Test for multi-input
  it("renders multiple input fields", () => {
    render(
      <MockForm>
        <CustomFormField name="testMultiInput" label="Test Multi Input" type="multi-input" />
      </MockForm>
    );

    const addButton = screen.getByText(/Add Item/i);
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    const multiInput = screen.getAllByPlaceholderText(/Test Multi Input/i);
    expect(multiInput.length).toBe(1); // Assuming only one input is added initially

    // Test removing an item
    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);
    expect(multiInput.length).toBe(0); // After removing, the count should be zero
  });

  // Test for disabled input
  it("renders a disabled text input field", () => {
    render(
      <MockForm>
        <CustomFormField name="disabledInput" label="Disabled Input" type="text" disabled />
      </MockForm>
    );

    const input = screen.getByLabelText(/Disabled Input/i);
    expect(input).toBeDisabled();
  });
});