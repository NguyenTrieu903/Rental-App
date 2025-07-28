import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import FiltersFull from './FiltersFull';
import { rootReducer } from '@/state'; // Assuming there's a root reducer defined in your state management
import { setFilters } from '@/state'; // Import the action to set filters

// Mocking the necessary hooks and dependencies
jest.mock('@/state/redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));

jest.mock('lodash', () => ({
  debounce: jest.fn((fn) => fn),
}));

jest.mock('@/lib/utils', () => ({
  cleanParams: jest.fn((filters) => filters), // Assume it just returns the filters for simplicity
  cn: jest.fn((...classes) => classes.join(' ')), // Join classes for simplicity
  formatEnumString: jest.fn((str) => str), // Just return the string as is
}));

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ lon: '0', lat: '0', display_name: 'Mock Location' }]),
  })
) as jest.Mock;

const renderWithRedux = (component: React.ReactNode, initialState = {}) => {
  const store = createStore(rootReducer, {
    global: {
      filters: {
        location: '',
        propertyType: 'any',
        priceRange: [0, 10000],
        beds: 'any',
        baths: 'any',
        squareFeet: [0, 5000],
        amenities: [],
        availableFrom: 'any',
        coordinates: [0, 0],
      },
      isFiltersFullOpen: true,
      ...initialState,
    },
  });

  return render(<Provider store={store}>{component}</Provider>);
};

describe('FiltersFull Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders FiltersFull component when isFiltersFullOpen is true', () => {
    renderWithRedux(<FiltersFull />);
    expect(screen.getByText(/Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Property Type/i)).toBeInTheDocument();
  });

  test('does not render FiltersFull component when isFiltersFullOpen is false', () => {
    renderWithRedux(<FiltersFull />, { global: { isFiltersFullOpen: false } });
    expect(screen.queryByText(/Location/i)).not.toBeInTheDocument();
  });

  test('submits filters and updates URL correctly', async () => {
    const { router } = require('next/navigation');
    renderWithRedux(<FiltersFull />);

    fireEvent.change(screen.getByPlaceholderText(/Enter location/i), {
      target: { value: 'New York' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('New York'));
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter location/i).value).toBe('New York');
    });

    fireEvent.click(screen.getByRole('button', { name: /APPLY/i }));

    expect(router.replace).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith(expect.stringContaining('location=New York'));
  });

  test('handles location search with valid response', async () => {
    renderWithRedux(<FiltersFull />);

    fireEvent.change(screen.getByPlaceholderText(/Enter location/i), {
      target: { value: 'Valid Location' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('Valid Location'));
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter location/i).value).toBe('Valid Location');
    });
  });

  test('handles location search with no results', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    renderWithRedux(<FiltersFull />);

    fireEvent.change(screen.getByPlaceholderText(/Enter location/i), {
      target: { value: 'Invalid Location' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter location/i).value).toBe('Invalid Location');
    });
    expect(console.log).toHaveBeenCalledWith('No location found for the search term');
  });

  test('handles reset filters correctly', async () => {
    renderWithRedux(<FiltersFull />);

    fireEvent.change(screen.getByPlaceholderText(/Enter location/i), {
      target: { value: 'Some Location' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Reset Filters/i }));

    expect(screen.getByPlaceholderText(/Enter location/i).value).toBe('');
  });

  test('handles amenity change correctly', () => {
    renderWithRedux(<FiltersFull />);

    const amenityButton = screen.getByText(/some-amenity/i); // Adjust this to match your amenity names
    fireEvent.click(amenityButton);

    expect(amenityButton).toHaveClass('border-black'); // Assuming selected amenities have this class
  });
});