import Marquee from 'react-fast-marquee'

const TrustedBy = () => {
  return (
    <section className="lg:mb-10 flex flex-col gap-3 lg:gap-4">
      <h4
        className="
          font-semibold text-black dark:text-white 
          text-[18px] lg:text-[26px] md:text-[22px]
          inline-flex items-center gap-1 hover:gap-3 duration-200
          px-4
        "
      >
        Нам доверяют
      </h4>

      <Marquee autoFill pauseOnHover>
        {['brand-1', 'brand-2', 'brand-3', 'brand-4', 'brand-5', 'brand-6'].map((brand, i) => (
          <div
            key={i}
            className="
              bg-white dark:bg-neutral-800
              rounded-2xl shadow-sm
              px-12 py-10 mr-6
              flex items-center justify-center
              text-lg sm:text-base xs:text-sm
              whitespace-nowrap
              transition-transform hover:scale-105
            "
          >
            {brand}
          </div>
        ))}
      </Marquee>
    </section>
  )
}

export default TrustedBy
