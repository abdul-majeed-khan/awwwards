
import PropTypes from 'prop-types'

const Button = ({ title, id, leftIcon, containerClass }) => {
  return (
    <button id={id} className={`group relative z-10 w-fit corsur-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black ${containerClass}`}>
        {leftIcon}

        <span className="relative incline-flex oevrflow-hidden font-general text-xs uppercase">
            <div>
                {title}
            </div>
        </span>
    </button>
  )
}

Button.propTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  rightIcon: PropTypes.element,
  leftIcon: PropTypes.element,
  containerClass: PropTypes.string
}

export default Button