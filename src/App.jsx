import TicketGenerator from './components/TicketGenerator'

function App() {
  return (
    <div className="bg-flisol-black text-white min-h-dvh overflow-x-hidden">
      <main>
        <section
          id="pase"
          className="flex min-h-dvh flex-col justify-center py-10 sm:py-12"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <TicketGenerator />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
