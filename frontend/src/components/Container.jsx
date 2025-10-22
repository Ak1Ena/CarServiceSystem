import PropTypes from "prop-types";

function Container({ children }){
    return <main className="bg-[#222121] min-h-screen w-full flex flex-col">{children}</main>
}

Container.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Container;