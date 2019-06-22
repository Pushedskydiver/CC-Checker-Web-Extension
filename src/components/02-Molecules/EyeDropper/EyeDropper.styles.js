import styled from 'styled-components';

const EyeDropper = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 64px;
  height: 64px;
  border: 2px solid rgb(221, 221, 221);
  border-radius: 50%;
  transform: translate3d(0px, 0px, 0px);
  overflow: hidden;
  z-index: 20;

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

export default EyeDropper;
