// client/src/app/(nondashboard)/search/[id]/ApplicationModal.test.tsx

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { useCreateApplicationMutation } from "@/state/api/applicationApi";
import { useGetAuthUserQuery } from "@/state/api/authApi";
import ApplicationModal from "./ApplicationModal";
import { ApplicationFormData } from "@/lib/schemas";

// Mocking external dependencies
jest.mock("@/state/api/applicationApi", () => ({
  useCreateApplicationMutation: jest.fn(),
}));

jest.mock("@/state/api/authApi", () => ({
  useGetAuthUserQuery: jest.fn(),
}));

describe("ApplicationModal", () => {
  const mockCreateApplication = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    (useCreateApplicationMutation as jest.Mock).mockReturnValue([mockCreateApplication]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (isOpen: boolean, authUser: any = null) => {
    (useGetAuthUserQuery as jest.Mock).mockReturnValue({ data: authUser });
    return render(<ApplicationModal isOpen={isOpen} onClose={mockOnClose} propertyId="property-id" />);
  };

  it("should render the modal when isOpen is true", () => {
    const { getByText } = renderComponent(true);
    expect(getByText("Submit Application for this Property")).toBeInTheDocument();
  });

  it("should not render the modal when isOpen is false", () => {
    const { queryByText } = renderComponent(false);
    expect(queryByText("Submit Application for this Property")).not.toBeInTheDocument();
  });

  it("should call createApplication with correct data when form is submitted", async () => {
    const authUser = { userRole: "tenant", cognitoInfo: { userId: "tenant-id" } };
    const { getByPlaceholderText, getByText } = renderComponent(true, authUser);

    fireEvent.change(getByPlaceholderText("Enter your full name"), { target: { value: "John Doe" } });
    fireEvent.change(getByPlaceholderText("Enter your email address"), { target: { value: "john@example.com" } });
    fireEvent.change(getByPlaceholderText("Enter your phone number"), { target: { value: "1234567890" } });
    fireEvent.change(getByPlaceholderText("Enter any additional information"), { target: { value: "Looking forward to this property!" } });

    fireEvent.click(getByText("Submit Application"));

    await waitFor(() => {
      expect(mockCreateApplication).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
        message: "Looking forward to this property!",
        applicationDate: expect.any(String),
        status: "Pending",
        propertyId: "property-id",
        tenantCognitoId: "tenant-id",
      });
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should log an error and not call createApplication if user is not a tenant", async () => {
    const authUser = { userRole: "admin", cognitoInfo: { userId: "admin-id" } };
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const { getByText } = renderComponent(true, authUser);

    fireEvent.click(getByText("Submit Application"));

    await waitFor(() => {
      expect(mockCreateApplication).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith("You must be logged in as a tenant to submit an application");
    });

    consoleErrorSpy.mockRestore();
  });

  it("should not call createApplication if authUser is null", async () => {
    const { getByText } = renderComponent(true, null);

    fireEvent.click(getByText("Submit Application"));

    await waitFor(() => {
      expect(mockCreateApplication).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it("should close the modal when onClose is called", () => {
    const { getByText } = renderComponent(true);
    fireEvent.click(getByText("Submit Application"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});