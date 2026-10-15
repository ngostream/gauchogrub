import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import FoodReview from './FoodReview.jsx'

vi.mock('axios', () => ({ default: { get: vi.fn(), post: vi.fn() } }))
vi.mock('leo-profanity', () => ({ default: { check: vi.fn(() => false) } }))

function renderReview() {
  return render(
    <MemoryRouter initialEntries={['/Carrillo/Pizza']}>
      <Routes>
        <Route path="/:hN/:foodItem" element={<FoodReview />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('FoodReview', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example/')
    vi.stubGlobal('alert', vi.fn())
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('loads and displays reviews from the API', async () => {
    axios.get.mockResolvedValue({ data: {
      avg_rating: 4,
      reviews: [{ rating: 4, comment: 'Tasty', created_at: '2026-10-14' }],
    } })
    renderReview()

    expect(await screen.findByText('Tasty')).toBeTruthy()
    expect(axios.get).toHaveBeenCalledWith('https://api.example/Carrillo/Pizza')
    expect(JSON.parse(localStorage.getItem('Carrillo-Pizza-reviews')).reviews[0].comment).toBe('Tasty')
  })

  it('uses cached reviews on first render', async () => {
    localStorage.setItem('Carrillo-Pizza-reviews', JSON.stringify({
      reviews: [{ rating: 5, comment: 'Cached review', created_at: '2026-10-14' }],
    }))
    renderReview()

    expect(await screen.findByText('Cached review')).toBeTruthy()
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('rejects a blank review without posting', async () => {
    axios.get.mockResolvedValue({ data: { reviews: [] } })
    const user = userEvent.setup()
    renderReview()
    await waitFor(() => expect(axios.get).toHaveBeenCalledOnce())

    await user.type(screen.getByPlaceholderText('Write your review here...'), '   ')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(alert).toHaveBeenCalledWith('Please enter a review before submitting.')
    expect(axios.post).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Submit' }).disabled).toBe(false)
  })

  it('submits a review, refreshes the list, and invalidates rating cache', async () => {
    axios.get
      .mockResolvedValueOnce({ data: { reviews: [] } })
      .mockResolvedValueOnce({ data: {
        reviews: [{ rating: 3, comment: 'Great!', created_at: '2026-10-14' }],
      } })
    axios.post.mockResolvedValue({ data: { message: 'received' } })
    const ratingsUpdated = vi.fn()
    window.addEventListener('ratingsUpdated', ratingsUpdated)
    const user = userEvent.setup()
    renderReview()
    await waitFor(() => expect(axios.get).toHaveBeenCalledOnce())
    localStorage.setItem('Carrillo-avgRatings', '{"Pizza":3}')

    await user.type(screen.getByPlaceholderText('Write your review here...'), 'Great!')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
      'https://api.example/Carrillo/Pizza',
      { name: 'Pizza', review: 'Great!', rating: 3 },
      { headers: { 'Content-Type': 'application/json' } },
    ))
    expect(await screen.findByText('Great!')).toBeTruthy()
    expect(axios.get).toHaveBeenCalledTimes(2)
    expect(localStorage.getItem('Carrillo-avgRatings')).toBeNull()
    expect(JSON.parse(localStorage.getItem('Carrillo-Pizza-reviews')).reviews[0].comment).toBe('Great!')
    expect(ratingsUpdated).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Submitted' }).disabled).toBe(true)
    window.removeEventListener('ratingsUpdated', ratingsUpdated)
  })

  it('keeps the form available when the API rejects a submission', async () => {
    axios.get.mockResolvedValue({ data: { reviews: [] } })
    axios.post.mockRejectedValue(new Error('network unavailable'))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    renderReview()
    await waitFor(() => expect(axios.get).toHaveBeenCalledOnce())
    localStorage.setItem('Carrillo-avgRatings', '{"Pizza":3}')

    await user.type(screen.getByPlaceholderText('Write your review here...'), 'Good')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => expect(axios.post).toHaveBeenCalledOnce())
    await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' }).disabled).toBe(false))
    expect(localStorage.getItem('Carrillo-avgRatings')).toBe('{"Pizza":3}')
    expect(screen.getByPlaceholderText('Write your review here...').value).toBe('Good')
  })
})
