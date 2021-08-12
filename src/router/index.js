import Home from '@/container/Home';
import Data from '@/container/Data';
import User from '@/container/User';
import About from '@/container/About';

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/data",
    component: Data
  },
  {
    path: "/user",
    component: User
  },
  {
    path: "/about",
    component: About
  }
];

export default routes;