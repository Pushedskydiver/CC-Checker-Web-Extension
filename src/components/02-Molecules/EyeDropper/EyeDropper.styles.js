import styled from 'styled-components';

const EyeDropperStyles = styled.div`
  position: absolute;
  width: 64px;
  height: 64px;
  border-width: 2px;
  border-style: solid;
  border-color: rgb(221, 221, 221);
  border-image: initial;
  border-radius: 1e+07px;
  transform: translate3d(0px, 0px, 0px);
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    width: 80px;
    height: 80px;
    background-image: url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 100% 100%\" xmlns=\"http://www.w3.org/2000/svg\"> <defs> <pattern id=\"smallGrid\" width=\"10\" height=\"10\" patternUnits=\"userSpaceOnUse\"> <path d=\"M 10 0 L 0 0 0 10\" fill=\"none\" stroke=\"black\" stroke-width=\"0.5\" /> </pattern> </defs> <svg x=\"0\" y=\"0\"> <rect width=\"100%\" height=\"100%\" fill=\"url(%23smallGrid)\" /> </svg> <svg x=\"-10\" y=\"-10\"> <rect x=\"50%\" y=\"50%\" width=\"10\" height=\"10\" fill=\"none\" stroke=\"red\" stroke-width=\"1\" /> </svg> </svg>');
    z-index: 10;
  }
`;

export default EyeDropperStyles;
