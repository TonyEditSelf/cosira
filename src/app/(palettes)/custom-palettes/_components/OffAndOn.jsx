export default function OffAndOn({ isItOn, setItOn }) {
  return (
    <>
      <span
        className={`border w-14 h-5 border-[var(--navBorder)] rounded-md flex items-center ${
          isItOn ? "justify-end" : "justify-start"
        } `}
      >
        <span
          onClick={setItOn}
          className={`rounded-full w-5 h-5 ${
            isItOn ? "bg-[var(--brand)]" : "bg-[var(--mutedBrand)] "
          }`}
        ></span>
      </span>
    </>
  );
}
