import ScreenContextProvider from "./context/ScreenContext";
import EarningsList from "./components/EarningList";

const Earnings = () => {

  return (
    <ScreenContextProvider>
        <EarningsList />
    </ScreenContextProvider>
  );
};


export default Earnings;
