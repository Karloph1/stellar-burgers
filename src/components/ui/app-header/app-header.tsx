import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import { Link, NavLink } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          className={({ isActive }) =>
            `text text_type_main-medium text_color_inactive pt-4 pb-4 ${
              styles.link
            } ${isActive ? styles.link_active : ''}`
          }
          end
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p
                className={`text text_type_main-default ml-2 mr-10 ${isActive ? styles.link_active : styles.link}`}
              >
                Конструктор
              </p>
            </>
          )}
        </NavLink>
        <NavLink
          to='/feed'
          className={({ isActive }) =>
            `text text_type_main-medium text_color_inactive pt-4 pb-4 ${
              styles.link
            } ${isActive ? styles.link_active : ''}`
          }
          end
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p
                className={`text text_type_main-default ml-2 ${isActive ? styles.link_active : styles.link}`}
              >
                Лента заказов
              </p>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <div className={styles.link_position_last}>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            `text text_type_main-medium text_color_inactive pt-4 pb-4 ${
              styles.link
            } ${isActive ? styles.link_active : ''}`
          }
          end
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p
                className={`text text_type_main-default ml-2 ${isActive ? styles.link_active : styles.link}`}
              >
                {userName || 'Личный кабинет'}
              </p>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
