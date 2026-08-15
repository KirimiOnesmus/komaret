import { Routes, Route } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import { PUBLIC_PATHS } from '../shared/constants/routes';

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Services from './pages/Services/Services';
import ServiceDetails from './pages/Services/ServiceDetails';
import ServiceRequest from './pages/Services/ServiceRequest';
import EstimateResult from './pages/Services/EstimateResult';
import RequestConfirmation from './pages/Services/RequestConfirmation';
import Projects from './pages/Projects/Projects';
import ProjectDetails from './pages/Projects/ProjectDetails';
import WhyChooseUs from './pages/WhyChooseUs/WhyChooseUs';
import News from './pages/News/News';
import NewsDetails from './pages/News/NewsDetails';
import Contact from './pages/Contact/Contact';
import Quote from './pages/Quote/Quote';



function PublicRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={PUBLIC_PATHS.HOME} element={<Home />} />
        <Route path={PUBLIC_PATHS.ABOUT} element={<About />} />
        <Route path={PUBLIC_PATHS.SERVICES} element={<Services />} />
        <Route path={PUBLIC_PATHS.SERVICE_DETAILS} element={<ServiceDetails />} />
        <Route path={PUBLIC_PATHS.SERVICE_REQUEST} element={<ServiceRequest />} />
        <Route path={PUBLIC_PATHS.ESTIMATE_RESULT} element={<EstimateResult />} />
        <Route path={PUBLIC_PATHS.REQUEST_CONFIRMATION} element={<RequestConfirmation />} />
        <Route path={PUBLIC_PATHS.PROJECTS} element={<Projects />} />
        <Route path={PUBLIC_PATHS.PROJECT_DETAILS} element={<ProjectDetails />} />
        <Route path={PUBLIC_PATHS.WHY_CHOOSE_US} element={<WhyChooseUs />} />
        <Route path={PUBLIC_PATHS.NEWS} element={<News />} />
        <Route path={PUBLIC_PATHS.NEWS_DETAILS} element={<NewsDetails />} />
        <Route path={PUBLIC_PATHS.CONTACT} element={<Contact />} />
        <Route path={PUBLIC_PATHS.QUOTE} element={<Quote />} />
      </Route>
    </Routes>
  );
}

export default PublicRoutes;
