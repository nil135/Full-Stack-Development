import './App.css'
import Card from './components/Card.jsx'

function App() {

  return (
    <div className='rounded-xl p-4'>
      <h1>Welcome to React!!!</h1>
      <p className='p-4'>I am learning react because I want to buy new car in 2026.</p>
      <div className='flex gap-4'>
        <Card
          title="My First Card"
          description="This is a sample card component."
          imageUrl="https://images.pexels.com/photos/831475/pexels-photo-831475.jpeg"
        />
        <Card
          title="My Second Car"
          description="This is a sample card component."
          imageUrl="https://images.pexels.com/photos/14809179/pexels-photo-14809179.jpeg"
        />
        <Card
          title="My Third Car"
          description="This is a sample card component."
          imageUrl="https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg"
        />
      </div>
    </div>
  )
}

export default App
