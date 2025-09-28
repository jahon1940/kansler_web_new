import Marquee from 'react-fast-marquee'

const TrustedBy = () => {
  return (
    <div className="mb-10 flex flex-col gap-4">
      <h4 className="font-semibold text-black dark:text-white text-[26px] inline-flex duration-200 hover:gap-3 gap-1 items-center">
        Нам доверяют
      </h4>
      <Marquee autoFill pauseOnHover>
        <div className="bg-white rounded-2xl p-12 mr-6">brand-1</div>
        <div className="bg-white rounded-2xl p-12 mr-6">brand-2</div>
        <div className="bg-white rounded-2xl p-12 mr-6">brand-3</div>
        <div className="bg-white rounded-2xl p-12 mr-6">brand-4</div>
      </Marquee>
    </div>
  )
}

export default TrustedBy
