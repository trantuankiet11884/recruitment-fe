import { Avatar, Dropdown, MenuProps } from 'antd';
import { Dispatch, memo, SetStateAction, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { AvatarPlaceHolder } from '~/assets/svg';
import { useAppSelector } from '~/hooks/useStore';
import icons from '~/utils/icons';
import { createBaseMenu, createUserMenu } from './menu/headerMenuItem';

const { LogoutOutlined } = icons;

interface IProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const HeaderDropDown = ({ setIsOpen }: IProps) => {
  const navigate = useNavigate();

  const refreshToken = localStorage.getItem('token2');
  const { currentUser } = useAppSelector((state) => state.auth);

  const userMenu = createUserMenu(navigate);
  const baseMenu = createBaseMenu({ currentUser, refreshToken });

  const menuItems: MenuProps['items'] = useMemo(() => {
    return [
      ...baseMenu,
      ...userMenu,
      { type: 'divider' as const },
      {
        key: 'logout',
        className: 'hover:!bg-light-warning',
        icon: <LogoutOutlined className="text-warning" />,
        label: <span className="text-warning font-medium">Đăng xuất</span>,
        onClick: () => setIsOpen(true),
      },
    ];
  }, [baseMenu, userMenu]);

  return (
    <>
      <Dropdown arrow trigger={['click']} menu={{ items: menuItems }}>
        <Avatar
          src={
            currentUser?.avatarUrl || (
              <AvatarPlaceHolder className="!w-14 !h-14 cursor-pointer" />
            )
          }
          alt="avatar"
          className="!w-14 !h-14 border-gray-200 cursor-pointer"
        />
      </Dropdown>
    </>
  );
};

export default memo(HeaderDropDown);
