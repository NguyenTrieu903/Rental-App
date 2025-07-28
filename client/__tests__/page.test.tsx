// client/src/app/(dashboard)/managers/applications/page.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/state/store"; // assuming you have a store setup
import Applications from "./page";
import {
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from "@/state/api/applicationApi";
import { useGetAuthUserQuery } from "@/state/api/authApi";

// Mock external dependencies
jest.mock("@/state/api/applicationApi");
jest.mock("@/state/api/authApi");

// Mock ApplicationCard and Loading component
jest.mock("@/components/ApplicationCard", () => (props) => (
  <div data-testid="application-card">{props.children}</div>
));
jest.mock("@/components/Loading", () => () => <div>Loading...</div>);
jest.mock("@/components/Header", () => ({ title, subtitle }) => (
  <header>
    <h1>{title}</h1>
    <h2>{subtitle}</h2>
  </header>
));

describe("Applications Component", () => {
  const mockUseGetAuthUserQuery = useGetAuthUserQuery as jest.MockedFunction<
    typeof useGetAuthUserQuery
  >;
  const mockUseGetApplicationsQuery = useGetApplicationsQuery as jest.MockedFunction<
    typeof useGetApplicationsQuery
  >;
  const mockUseUpdateApplicationStatusMutation = useUpdateApplicationStatusMutation as jest.MockedFunction<
    typeof useUpdateApplicationStatusMutation
  >;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseGetAuthUserQuery.mockReturnValue({ data: { cognitoInfo: { userId: "1" } } });
    mockUseGetApplicationsQuery.mockReturnValue({ isLoading: true });

    render(
      <Provider store={store}>
        <Applications />
      </Provider>
    );

    expect(screen.getByText(/Loading.../)).toBeInTheDocument();
  });

  it("renders error message on fetch error", () => {
    mockUseGetAuthUserQuery.mockReturnValue({ data: { cognitoInfo: { userId: "1" } } });
    mockUseGetApplicationsQuery.mockReturnValue({ isLoading: false, isError: true, data: null });

    render(
      <Provider store={store}>
        <Applications />
      </Provider>
    );

    expect(screen.getByText(/Error fetching applications/)).toBeInTheDocument();
  });

  it("renders applications correctly when data is fetched", () => {
    const applications = [
      { id: 1, status: "Pending", applicationDate: "2023-01-01", property: { id: "property1" } },
      { id: 2, status: "Approved", applicationDate: "2023-01-02", property: { id: "property2" } },
    ];

    mockUseGetAuthUserQuery.mockReturnValue({ data: { cognitoInfo: { userId: "1" } } });
    mockUseGetApplicationsQuery.mockReturnValue({ isLoading: false, isError: false, data: applications });

    render(
      <Provider store={store}>
        <Applications />
      </Provider>
    );

    expect(screen.getByText(/Applications/)).toBeInTheDocument();
    expect(screen.getByText(/View and manage applications for your properties/)).toBeInTheDocument();
    expect(screen.getByText(/Application submitted on 1\/1\/2023/)).toBeInTheDocument();
    expect(screen.getByText(/Application submitted on 1\/2\/2023/)).toBeInTheDocument();
  });

  it("updates application status to approved", async () => {
    const applications = [
      { id: 1, status: "Pending", applicationDate: "2023-01-01", property: { id: "property1" } },
    ];

    mockUseGetAuthUserQuery.mockReturnValue({ data: { cognitoInfo: { userId: "1" } } });
    mockUseGetApplicationsQuery.mockReturnValue({ isLoading: false, isError: false, data: applications });
    const updateApplicationStatusMock = jest.fn();
    mockUseUpdateApplicationStatusMutation.mockReturnValue([updateApplicationStatusMock]);

    render(
      <Provider store={store}>
        <Applications />
      </Provider>
    );

    const approveButton = screen.getByText(/Approve/);
    fireEvent.click(approveButton);

    expect(updateApplicationStatusMock).toHaveBeenCalledWith({ id: 1, status: "Approved" });
  });

  it("updates application status to denied", async () => {
    const applications = [
      { id: 1, status: "Pending", applicationDate: "2023-01-01", property: { id: "property1" } },
    ];

    mockUseGetAuthUserQuery.mockReturnValue({ data: { cognitoInfo: { userId: "1" } } });
    mockUseGetApplicationsQuery.mockReturnValue({ isLoading: false, isError: false, data: applications });
    const updateApplicationStatusMock = jest.fn();
    mockUseUpdateApplicationStatusMutation.mockReturnValue([updateApplicationStatusMock]);

    render(
      <Provider store={store}>
        <Applications />
      </Provider>
    );

    const denyButton = screen.getByText(/Deny/);
    fireEvent.click(denyButton);

    expect(updateApplicationStatusMock).toHaveBeenCalledWith({ id: 1, status: "Denied" });
  });

  it("filters applications based on the selected tab", () => {
    const applications = [
      { id: 1, status: "Pending", applicationDate: "2023-01-01", property: { id: "property1" } },
      { id: 2, status: "Approved", applicationDate: "2023-01-02", property: { id: "property2" } },
      { id: 3, status: "Denied", applicationDate: "2023-01-03", property: { id: "property3" } },
    ];

    mockUseGetAuthUserQuery.mockReturnValue({ data: { cognitoInfo: { userId: "1" } } });
    mockUseGetApplicationsQuery.mockReturnValue({ isLoading: false, isError: false, data: applications });

    render(
      <Provider store={store}>
        <Applications />
      </Provider>
    );

    // Check all applications
    expect(screen.getByText(/Pending/)).toBeInTheDocument();
    expect(screen.getByText(/Approved/)).toBeInTheDocument();
    expect(screen.getByText(/Denied/)).toBeInTheDocument();

    // Switch to Approved tab
    const approvedTab = screen.getByText(/Approved/);
    fireEvent.click(approvedTab);

    // Check only approved applications are displayed
    expect(screen.queryByText(/Pending/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Denied/)).not.toBeInTheDocument();
    expect(screen.getByText(/Approved/)).toBeInTheDocument();
  });
});

// Tests for changes in client/src/app/(dashboard)/tenants/applications/page.tsx
// client/src/app/(dashboard)/tenants/applications/page.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import Applications from './page';
import { useGetAuthUserQuery } from '@/state/api/authApi';
import { useGetApplicationsQuery } from '@/state/api/applicationApi';

// Mock the external dependencies
jest.mock('@/state/api/authApi', () => ({
  useGetAuthUserQuery: jest.fn(),
}));

jest.mock('@/state/api/applicationApi', () => ({
  useGetApplicationsQuery: jest.fn(),
}));

jest.mock('@/components/ApplicationCard', () => ({ children }) => (
  <div data-testid="application-card">{children}</div>
));

jest.mock('@/components/Header', () => ({ title, subtitle }) => (
  <div data-testid="header">
    <h1>{title}</h1>
    <h2>{subtitle}</h2>
  </div>
));

jest.mock('@/components/Loading', () => () => <div data-testid="loading">Loading...</div>);

describe('Applications Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    (useGetAuthUserQuery as jest.Mock).mockReturnValue({ data: null });
    (useGetApplicationsQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<Applications />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders error state when fetching applications fails', () => {
    (useGetAuthUserQuery as jest.Mock).mockReturnValue({ data: { cognitoInfo: { userId: 'user123' } } });
    (useGetApplicationsQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    render(<Applications />);

    expect(screen.getByText('Error fetching applications')).toBeInTheDocument();
  });

  it('renders the applications correctly when data is fetched successfully', () => {
    (useGetAuthUserQuery as jest.Mock).mockReturnValue({ data: { cognitoInfo: { userId: 'user123' } } });
    const mockApplications = [
      { id: '1', status: 'Approved', lease: { endDate: '2023-12-31' } },
      { id: '2', status: 'Pending', lease: null },
      { id: '3', status: 'Denied', lease: null },
    ];
    (useGetApplicationsQuery as jest.Mock).mockReturnValue({
      data: mockApplications,
      isLoading: false,
      isError: false,
    });

    render(<Applications />);

    // Check header rendering
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Applications')).toBeInTheDocument();
    expect(screen.getByText('Track and manage your property rental applications')).toBeInTheDocument();

    // Check application cards
    expect(screen.getAllByTestId('application-card')).toHaveLength(3);

    // Check content of each application card
    expect(screen.getByText('The property is being rented by you until 12/31/2023')).toBeInTheDocument();
    expect(screen.getByText('Your application is pending approval')).toBeInTheDocument();
    expect(screen.getByText('Your application has been denied')).toBeInTheDocument();
  });

  it('handles rendering applications with different statuses', () => {
    (useGetAuthUserQuery as jest.Mock).mockReturnValue({ data: { cognitoInfo: { userId: 'user123' } } });
    const mockApplications = [
      { id: '1', status: 'Approved', lease: { endDate: '2023-12-31' } },
      { id: '2', status: 'Pending', lease: null },
      { id: '3', status: 'Denied', lease: null },
    ];
    (useGetApplicationsQuery as jest.Mock).mockReturnValue({
      data: mockApplications,
      isLoading: false,
      isError: false,
    });

    render(<Applications />);

    // Check that the correct text is rendered based on the application status
    expect(screen.getByText('The property is being rented by you until 12/31/2023')).toBeInTheDocument();
    expect(screen.getByText('Your application is pending approval')).toBeInTheDocument();
    expect(screen.getByText('Your application has been denied')).toBeInTheDocument();
  });
});

// Tests for changes in client/src/app/(nondashboard)/search/[id]/page.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useGetAuthUserQuery } from "@/state/api/authApi";
import { useParams } from "next/navigation";
import SingleListing from "./page"; // Adjust the import path as necessary
import ImagePreviews from "./ImagePreviews";
import PropertyOverview from "./PropertyOverview";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import ContactWidget from "./ContactWidget";
import ApplicationModal from "./ApplicationModal";

// Mocking external dependencies
jest.mock("@/state/api/authApi", () => ({
  useGetAuthUserQuery: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

jest.mock("./ImagePreviews", () => jest.fn(() => <div>Image Previews</div>));
jest.mock("./PropertyOverview", () => jest.fn(() => <div>Property Overview</div>));
jest.mock("./PropertyDetails", () => jest.fn(() => <div>Property Details</div>));
jest.mock("./PropertyLocation", () => jest.fn(() => <div>Property Location</div>));
jest.mock("./ContactWidget", () => jest.fn(({ onOpenModal }) => (
  <button onClick={onOpenModal}>Open Modal</button>
)));
jest.mock("./ApplicationModal", () => jest.fn(({ isOpen, onClose }) => (
  isOpen ? <div>
    <h1>Application Modal</h1>
    <button onClick={onClose}>Close Modal</button>
  </div> : null
)));

describe("SingleListing Component", () => {
  const mockUseParams = useParams as jest.Mock;
  const mockUseGetAuthUserQuery = useGetAuthUserQuery as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders property details correctly", () => {
    // Arrange
    mockUseParams.mockReturnValue({ id: "123" });
    mockUseGetAuthUserQuery.mockReturnValue({ data: null }); // No auth user

    // Act
    render(<SingleListing />);

    // Assert
    expect(screen.getByText("Image Previews")).toBeInTheDocument();
    expect(screen.getByText("Property Overview")).toBeInTheDocument();
    expect(screen.getByText("Property Details")).toBeInTheDocument();
    expect(screen.getByText("Property Location")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open modal/i })).toBeInTheDocument();
    expect(screen.queryByText("Application Modal")).not.toBeInTheDocument(); // Modal should not be visible
  });

  test("opens modal when contact widget button is clicked and user is authenticated", () => {
    // Arrange
    mockUseParams.mockReturnValue({ id: "123" });
    mockUseGetAuthUserQuery.mockReturnValue({ data: { id: 1 } }); // Mock authenticated user

    // Act
    render(<SingleListing />);
    fireEvent.click(screen.getByRole("button", { name: /open modal/i }));

    // Assert
    expect(screen.getByText("Application Modal")).toBeInTheDocument(); // Modal should be visible
  });

  test("closes modal when close button is clicked", () => {
    // Arrange
    mockUseParams.mockReturnValue({ id: "123" });
    mockUseGetAuthUserQuery.mockReturnValue({ data: { id: 1 } }); // Mock authenticated user

    // Act
    render(<SingleListing />);
    fireEvent.click(screen.getByRole("button", { name: /open modal/i }));
    fireEvent.click(screen.getByRole("button", { name: /close modal/i }));

    // Assert
    expect(screen.queryByText("Application Modal")).not.toBeInTheDocument(); // Modal should not be visible
  });

  test("handles missing property id gracefully", () => {
    // Arrange
    mockUseParams.mockReturnValue({ id: undefined });
    mockUseGetAuthUserQuery.mockReturnValue({ data: null });

    // Act
    render(<SingleListing />);

    // Assert
    expect(screen.getByText("Image Previews")).toBeInTheDocument();
    expect(screen.getByText("Property Overview")).toBeInTheDocument();
    expect(screen.getByText("Property Details")).toBeInTheDocument();
    expect(screen.getByText("Property Location")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open modal/i })).toBeInTheDocument();
  });

  test("displays nothing if user is not authenticated and contact widget is clicked", () => {
    // Arrange
    mockUseParams.mockReturnValue({ id: "123" });
    mockUseGetAuthUserQuery.mockReturnValue({ data: null }); // No auth user

    // Act
    render(<SingleListing />);
    fireEvent.click(screen.getByRole("button", { name: /open modal/i }));

    // Assert
    expect(screen.queryByText("Application Modal")).not.toBeInTheDocument(); // Modal should not be visible
  });
});