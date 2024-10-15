import { Divider } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { BriefCase, LanguageCenter, MagicHat, Summary } from '~/assets/img';
import { Achievement, Bag, Language, PencilSkill } from '~/assets/svg';
import { useAppDispatch, useAppSelector } from '~/hooks/useStore';
import ProfileSection, {
  IProfileSection,
  ProfileSectionType,
} from '~/pages/User/Profile/ProfileSection';
import { getUserProfile } from '~/store/thunk/user';
import icons from '~/utils/icons';
import ExperienceCard from './Card/ExperienceCard';
import LanguageCard from './Card/LanguageCard';
import SkillCard from './Card/SkillCard';
import AchievementModal from './Modal/AchievementModal';

import { WorkExperience } from '~/types/User';
import ExperienceModal from './Modal/ExperienceModal';
import LanguageModal from './Modal/LanguageModal';
import SkillModal from './Modal/SkillModal';

const { PlusOutlined, EditOutlined } = icons;

const initExperience = {} as WorkExperience;

const Profile = () => {
  const dispatch = useAppDispatch();

  const [selectedItem, setSelectedItem] = useState('');
  const [experienceItemSelected, setExperienceItemSelected] =
    useState<WorkExperience>(initExperience);

  const { userProfile, loading } = useAppSelector((state) => state.user);
  const { currentUser } = useAppSelector((state) => state.auth);

  const refetchUserProfile = useCallback(() => {
    const { accessToken, refreshToken } = currentUser;
    dispatch(getUserProfile({ accessToken, refreshToken }));
  }, [currentUser]);

  const handleEditExperience = useCallback((values: WorkExperience) => {
    setExperienceItemSelected(values);
  }, []);

  const handleCancelExperience = useCallback(() => {
    setSelectedItem('');
    setExperienceItemSelected(initExperience);
  }, []);

  const items: IProfileSection[] = useMemo(
    () => [
      {
        id: ProfileSectionType.ACHIEVEMENT,
        imgUrl: Summary,
        header: {
          title: 'Thành tích / Kỹ năng nổi bật',
          suffixIcon: (
            <Achievement width={20} height={20} className="font-bold" />
          ),
        },
        buttonTitle: 'Cập nhật tóm tắt',
        hint: 'Tóm tắt về thành tích / kỹ năng nổi bật giúp hồ sơ của bạn tăng 3.9 lần lượt tiếp cận từ nhà tuyển dụng.',
        buttonActionTitle: (
          <EditOutlined className="text-[#691f74] cursor-pointer" />
        ),
        content: userProfile?.achivement?.description && (
          <div
            className="text-sm font-medium"
            dangerouslySetInnerHTML={{
              __html: userProfile.achivement.description,
            }}
          />
        ),
      },
      {
        id: ProfileSectionType.EXPERIENCE,
        imgUrl: BriefCase,
        header: {
          title: 'Kinh nghiệm',
          suffixIcon: <Bag width={20} height={20} className="font-bold" />,
        },
        buttonTitle: 'Thêm kinh nghiệm',
        hint: 'Thêm kinh nghiệm làm việc để giúp nhà tuyển dụng hiểu hơn về bạn',
        buttonActionTitle: (
          <PlusOutlined className="text-[#691f74] cursor-pointer" />
        ),
        content: userProfile.workExperiences?.length && (
          <ExperienceCard
            data={userProfile.workExperiences}
            refetch={refetchUserProfile}
            onEdit={handleEditExperience}
            setSelectedItem={setSelectedItem}
          />
        ),
      },
      {
        id: ProfileSectionType.LANGUAGE,
        imgUrl: LanguageCenter,
        header: {
          title: 'Ngoại ngữ',
          suffixIcon: <Language width={20} height={20} className="font-bold" />,
        },
        buttonTitle: 'Thêm ngoại ngữ',
        hint: 'Bạn biết những ngoại ngữ nào? Hãy thêm vào để tăng độ "hot" cho hồ sơ nhé.',
        buttonActionTitle: (
          <PlusOutlined className="text-[#691f74] cursor-pointer" />
        ),
        content: userProfile.userLanguages?.length && (
          <LanguageCard data={userProfile.userLanguages} />
        ),
      },
      {
        id: ProfileSectionType.SKILL,
        imgUrl: MagicHat,
        header: {
          title: 'Kỹ năng / Công cụ',
          suffixIcon: (
            <PencilSkill width={20} height={20} className="font-bold" />
          ),
        },
        buttonTitle: 'Thêm kỹ năng',
        hint: 'Kỹ năng / công cụ giúp bạn nổi bật hơn trong mắt nhà tuyển dụng.',
        buttonActionTitle: (
          <PlusOutlined className="text-[#691f74] cursor-pointer" />
        ),
        content: userProfile.userSkills?.length && (
          <SkillCard data={userProfile.userSkills} />
        ),
      },
    ],
    [userProfile]
  );

  useEffect(() => {
    refetchUserProfile();
  }, []);

  return (
    <>
      {items.map((item, index) => (
        <div key={index}>
          <ProfileSection
            {...item}
            loading={loading}
            onClick={() => setSelectedItem(item.id)}
          />
          {index !== items.length - 1 && <Divider />}
        </div>
      ))}
      <AchievementModal
        data={userProfile?.achivement?.description}
        isOpen={selectedItem === ProfileSectionType.ACHIEVEMENT}
        refetch={refetchUserProfile}
        setSelectedItem={setSelectedItem}
      />
      <ExperienceModal
        data={experienceItemSelected}
        isOpen={selectedItem === ProfileSectionType.EXPERIENCE}
        refetch={refetchUserProfile}
        onCancel={handleCancelExperience}
      />
      <LanguageModal
        isOpen={selectedItem === ProfileSectionType.LANGUAGE}
        setSelectedItem={setSelectedItem}
      />
      <SkillModal
        isOpen={selectedItem === ProfileSectionType.SKILL}
        setSelectedItem={setSelectedItem}
      />
    </>
  );
};

export default Profile;
