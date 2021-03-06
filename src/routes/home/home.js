import { useEffect } from 'preact/hooks';
import { Provider, connect } from 'react-redux';
import './home.scss';
import AnalysisInterface from '../../state/analysis_interface.js';
import store from '../../state/store.js';
import PathViewer from '../../components/path_viewer/path_viewer.js';
import Sidebar from '../../components/sidebar/sidebar.js';
import FileInterface from '../../state/file_interface.js';

const Home = (props) => {
	useEffect(() => {
		const toExpose = {
			store,
			AnalysisInterface,
			FileInterface
		};

		for (let [key, value] of Object.entries(toExpose)) {
			window[key] = value;
		}

		AnalysisInterface.analyze();
	}, []);

	return (
		<div class="home">
			<PathViewer
				gpsTrack={props.gpsTrack}
				smoothedGPSTrack={props.smoothedGPSTrack}
				targetLine={props.targetLine}
			/>

			<Sidebar {...props} />
		</div>
	);
};

const ConnectedHome = connect(state => state)((props) => (
	<Home {...props} />
));

const HomeWithStore = () => (
	<Provider store={store}>
		<ConnectedHome />
	</Provider>
);

export default HomeWithStore;
