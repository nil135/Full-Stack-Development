import Card from "./components/Cards.jsx";

export default function App() {
  return (
    <div className="App text-center p-4">
      <div className='rounded-xl p-4 text-center'>
        <h1>Welcome to React!!!</h1>
        <p className='p-4'>I am learning react because I want to buy a new car in 2026.</p>
      </div>
      <div className="flex gap-4">
        <Card
          title="Red Punch"
          description="This is a sample card component."
          imageUrl="https://stimg.cardekho.com/images/car-images/930x620/Tata/Punch/13202/1768376767777/222_-Bengal-Rouge_FF0D33.jpg?tr=w-898"
        />
        <Card
          title="Cyan Punch"
          description="This is a sample card component."
          imageUrl="https://stimg.cardekho.com/images/car-images/930x620/Tata/Punch/13202/1768376767777/221_Cyantafic_26CCFF.jpg?tr=w-898"
        />
        <Card
          title="Grey Punch"
          description="This is a sample card component."
          imageUrl="https://stimg.cardekho.com/images/car-images/930x620/Tata/Punch/13202/1768376767777/225_Daytona-Grey_38393B.jpg?tr=w-898"
        />
        <Card
          title="White Punch"
          description="This is a sample card component."
          imageUrl="https://stimg.cardekho.com/images/car-images/930x620/Tata/Punch/13202/1768376767777/226_Pristine-White_FEFEFE.jpg?tr=w-898"
        />
        <Card
          title="Caramel Punch"
          description="This is a sample card component."
          imageUrl="https://stimg.cardekho.com/images/car-images/930x620/Tata/Punch/13202/1768376767777/223_Caramel_E67317.jpg?tr=w-898"
        />
      </div>
    </div>
  );
}