import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ManyFieldsForm from "./ManyFieldsForm";
import {UtilService} from "../src";


UtilService.setIntlFormatter(({id}: {id: any}) => id);
UtilService.setPrimeflexVersion(3);
const App = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Component Demo</h1>
      <ManyFieldsForm />
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
