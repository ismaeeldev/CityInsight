import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

// project imports
import NavigationScroll from 'layout/NavigationScroll'; 
import ThemeCustomization from 'themes';
import MainProvider from './views/context/index.jsx';   

// ==============================|| APP ||============================== //

export default function App() {            
  return (
    <MainProvider>
      <ThemeCustomization>
        <NavigationScroll>
          <RouterProvider router={router} />
        </NavigationScroll>
      </ThemeCustomization>
    </MainProvider>
  );
}
