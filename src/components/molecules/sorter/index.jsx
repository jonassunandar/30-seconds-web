import React from 'react';
import PropTypes from 'typedefs/proptypes';
import { combineClassNames } from 'utils';
import { useClickOutside } from 'components/hooks';

const propTypes = {
  sorter: PropTypes.sorter,
};

/**
 * Renders a sorter component.
 */
const Sorter = ({
  sorter: {
    orders,
    selectedOrder,
  },
}) => {
  const [toggled, setToggled] = React.useState(false);
  const sorterRef = React.useRef();

  const handleSorterClick = e => {
    if (!toggled || e.target.className.includes('selected')) {
      e.preventDefault();
      if(!toggled) setToggled(true);
      else setToggled(false);
    }
  };

  useClickOutside(sorterRef, () => { setToggled(false); });

  return (
    <div
      className={ combineClassNames`sorter ${toggled ? 'open' : ''}` }
      ref={ sorterRef }
    >
      <div className='sorter-inner'>
        {
          orders
            .sort((a, b) => a.title === selectedOrder ? -1 : b.title === selectedOrder ? 1 : 0)
            .map(order => (
              <a
                key={ `${order.url}` }
                className={ combineClassNames`btn order-btn
                ${order.title === selectedOrder ? `selected icon ${toggled ? 'icon-chevron-up' : 'icon-chevron-down'}` : ''}
              ` }
                href={ order.url }
                onClick={ e => handleSorterClick(e) }
              >
                { order.title }
              </a>
            ))
        }
      </div>
    </div>
  );
};

Sorter.propTypes = propTypes;

export default Sorter;
