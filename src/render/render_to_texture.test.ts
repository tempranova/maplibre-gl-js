import RenderToTexture from './render_to_texture';
import type Painter from './painter';
import type LineStyleLayer from '../style/style_layer/line_style_layer';
import type SymbolStyleLayer from '../style/style_layer/symbol_style_layer';
import type Terrain from './terrain';
import type Style from '../style/style';

describe('render to texture', () => {
    test('should render text after a line by not adding the text to the stack', () => {
        const terrain = {
            sourceCache: {
                getRenderableTiles: () => [],
                removeOutdated: () => {}
            },
            clearRerenderCache: () => {}
        } as any as Terrain;
        const style = {
            map: {
                terrain
            },
            _order: []
        } as any as Style;
        const painterMock = {
            style,  
            transform: {
                zoom: 10
            }
        } as any as Painter;
        const uut = new RenderToTexture(painterMock, terrain);
        uut.initialize(style, 10);
        const lineLayer = {
            id: 'maine-line',
            type: 'line',
            source: 'maine',
        } as LineStyleLayer;
        lineLayer.isHidden = () => false;
        const symbolLayer = {
            id: 'maine-text',
            type: 'symbol',
            source: 'maine',
            layout: {
                'text-field': 'maine',
                'symbol-placement': 'line'
            },
            isHidden: () => false
        } as any as SymbolStyleLayer;
        expect(uut.renderLayer(lineLayer)).toBeTruthy();
        painterMock.style._order = ['maine-line', 'maine-text'];
        painterMock.currentLayer = 1;
        expect(uut.renderLayer(symbolLayer)).toBeFalsy();
    });
});
