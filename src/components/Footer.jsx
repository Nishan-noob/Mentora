import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex items-center justify-between py-2 px-8 bg-[#080d13] text-gray-400">
      <Link href="/other">
        <p className="text-green-300 hover:cursor-pointer hover:underline underline-offset-4 ">
          Other Useful Sites
        </p>
      </Link>
      <p className="text-center">Made with ❤️ as part of TechSoc IITM.</p>
      <Link passHref href="/feedback">
        <p className="text-green-300 hover:cursor-pointer hover:underline underline-offset-4 ">
          Feedback
        </p>
      </Link>
    </div>
  );
};
export default Footer;
