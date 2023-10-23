import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Dashboard } from '.'

const mockUsedNavigate = jest.fn();
const mockUsedLocation = jest.fn();
jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
  useLocation: () => mockUsedLocation,
}));

describe("Dashboard page", () => {
    const setup = () => {
        const view = render(<Dashboard />)
        return view
    }

    it("test page load", async () => {
        setup()

        screen.getByRole('heading', { name: /face recognition dashboard/i })
        screen.getByRole('heading', { name: /click on upload to add files/i })
        screen.getByRole('button', { name: /upload/i })
        screen.getByRole('button', { name: /logout/i })
    })

})
