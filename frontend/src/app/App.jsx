import AppRoutes from "./routes"
import Container from "../components/Container"
import Header from "../components/Header"
function App() {
  return (
    <>
      <Container>
        <Header/>
        <AppRoutes />
      </Container>
    </>
  )
}

export default App
