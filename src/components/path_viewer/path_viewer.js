import { Component } from 'preact';

export default class PathViewer extends Component {

    constructor(props) {
        super(props);

        this._id = `cesium-viewer-${Math.random().toString(36).slice(2)}`
    }

    componentDidMount() {
        this.viewer = new window.Cesium.Viewer(this._id, {
            terrainProvider: window.Cesium.createWorldTerrain(),
            timeline: false,
            animation: false
        });

        const dataSource = new Cesium.CzmlDataSource();

        dataSource.process([
            {
                id: "document",
                version: "1.0",
            },
            {
                id: "target-line",
                name: "Target Line",
                polyline: {
                    positions: {
                        cartographicDegrees: [
                            this.props.targetLine.start.longitude, this.props.targetLine.start.latitude, 0,
                            this.props.targetLine.end.longitude, this.props.targetLine.end.latitude, 0
                        ],
                    },
                    material: {
                        solidColor: {
                            color: {
                                rgba: [255, 255, 0, 255],
                            },
                        },
                    },
                    width: 3,
                    clampToGround: true,
                },
            }
        ]);

        this.dataSource = dataSource;
        this.viewer.dataSources.add(dataSource);
        this.viewer.zoomTo(dataSource);
    }

    componentDidUpdate(prevProps) {
        let czml = [];

        if (prevProps.targetLine !== this.props.targetLine) {
            const cartographicDegrees = [
                parseFloat(this.props.targetLine.start.longitude), parseFloat(this.props.targetLine.start.latitude), 0,
                parseFloat(this.props.targetLine.end.longitude), parseFloat(this.props.targetLine.end.latitude), 0
            ];

            let valid = true;

            for (let coord of cartographicDegrees) {
                if (isNaN(coord)) {
                    valid = false;
                    console.log(this.props.targetLine);
                    break;
                }
            }

            if (valid) {
                czml.push({
                    id: "target-line",
                    polyline: {
                        positions: {
                            cartographicDegrees
                        }
                    },
                })
            }
        }

        if (czml.length) {
            this.viewer.zoomTo(this.dataSource);
            this.dataSource.process(czml);
        }
    }

    componentWillUnmount() {
        this.viewer.destroy();
    }

    render() {
        return (
            <div className="cesium-viewer-container" id={this._id} />
        );
    }

}
