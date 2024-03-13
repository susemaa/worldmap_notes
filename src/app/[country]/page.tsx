import {
  countries, getCountryCode, jsxpaths,
} from '@/utils';

export default function Country({ params }: { params: { country: string } }) {
  const countryCode: string = params.country.toUpperCase();
  if (!Object.hasOwn(countries, countryCode)) return <div>Error</div>;

  return (
    <svg
      className="w-full h-full"
      fill="#c6c6c6"
      baseProfile="tiny"
      height="857"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth=".2"
      version="1.2"
      viewBox="0 0 2000 857"
      width="2000"
      xmlns="http://www.w3.org/2000/svg"
    >
      {jsxpaths.filter((path) => getCountryCode(path.props.id, path.props.className) === countryCode)}
    </svg>
  );
}
