import AppRoutes from "./routes"
import Container from "../components/Container"
import Header from "../components/Header"
function App() {
  const userId = localStorage.getItem("userId");

  return (
    <>
      <Container>
        <Header key={userId} />
        <AppRoutes />
      </Container>
    </>
  )
}

export default App
