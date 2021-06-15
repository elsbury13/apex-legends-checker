import axios from 'axios'
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';

import App from './App';

jest.mock('axios')

const FOLLOWS = 2;
const USER = 'Elsbury99';
const PLATINUM = 'Platinum';
const CURRENT_LEGEND = 'Bangalore';

const mockGetRequest = {
  data: {
    global: {
      name: USER,
      platform: 'X1',
      level: 9999,
      rank: {
        rankScore: 4800,
        rankName: PLATINUM,
        rankDiv: 4,
        ladderPosPlatform: -1,
        rankImg: 'https://api.mozambiquehe.re/assets/ranks/platinum4.png',
        rankedSeason: 'season09_split_1'
      },
      arena: {
        rankName: 'Bronze',
        rankDiv: 4,
        ladderPosPlatform: -1,
        rankImg: 'https://api.mozambiquehe.re/assets/ranks/bronze4.png',
        rankedSeason: 'none'
      }
    },
    realtime: {
      lobbyState: 'open',
      isOnline: 0,
      isInGame: 0,
      canJoin: 0,
      partyFull: 0,
      selectedLegend: CURRENT_LEGEND
    },
    legends: {
      selected: {
        LegendName: CURRENT_LEGEND,
        data: [
          {
            name: 'Season 4 Wins',
            value: 9999,
            key: 'wins_season_4'
          }
        ],
        ImgAssets: {
          icon: 'https://api.mozambiquehe.re/assets/icons/bangalore.png',
          banner: 'https://api.mozambiquehe.re/assets/banners/bangalore.jpg'
        }
      },
    }
  }
}

describe('App component', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn()
    const mockAxiosGet = jest.fn(() => Promise.resolve(mockGetRequest))
    axios.get.mockImplementation(mockAxiosGet)
  })
  afterEach(() => {
    jest.clearAllMocks()
    cleanup()
  })

  it('renders information', async () => {
    const mockGet = jest.fn(() => Promise.resolve(mockGetRequest))
    axios.get.mockImplementation(mockGet)

    render(<App />);

    await waitFor(() => expect(screen.getAllByText(USER)[0]).toBeInTheDocument());
    expect(screen.queryByText(CURRENT_LEGEND)).toBeInTheDocument();
    expect(screen.getByAltText(PLATINUM)).toBeTruthy();

    // Squad
    expect(screen.getAllByText(USER)[1]).toBeInTheDocument();
    expect(screen.getByText('Elsbury98').compareDocumentPosition(screen.getAllByText(USER)[1])).toBe(FOLLOWS);
  })

  it('does not render information', async () => {
    const error = new Error('Some test error');
    const mockGet = jest.fn(() => Promise.reject(error));

    axios.get.mockImplementation(mockGet);

    render(<App />);

    await waitFor(() => expect(screen.queryByText('Something went wrong ...')).toBeInTheDocument());
  })

  it('can choose anothor legend information when clicking', async () => {
    const mockGet = jest.fn(() => Promise.resolve(mockGetRequest))
    axios.get.mockImplementation(mockGet)

    render(<App />);

    await waitFor(() => expect(screen.getAllByText(USER)[0]).toBeInTheDocument());
    expect(screen.getByText('Elsbury98')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Elsbury98'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2)
    })
  })

  it('can choose anothor legend information when searching', async () => {
    const mockGet = jest.fn(() => Promise.resolve(mockGetRequest))
    axios.get.mockImplementation(mockGet)

    render(<App />);

    await waitFor(() => expect(screen.getAllByText(USER)[0]).toBeInTheDocument());
    expect(screen.getByText('Elsbury98')).toBeInTheDocument();

    fireEvent.change(
      screen.getByRole('textbox'), {
        target: { value: 'TEST' }
      }
    )

    fireEvent.click(screen.getByTestId('search-player'));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2)
    })
  })
})