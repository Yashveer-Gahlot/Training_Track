import { User } from "@/types/User";
import { Card, CardContent } from "@/components/ui/card";
import Profile from "@/components/Profile";
import Settings from "@/components/Settings";
import { Response } from "@/types/Response";

type ProfileSectionProps = {
  user: User | null | undefined;
  logout: () => void;
  changeUserLevel: (newLevelNumber: number) => Promise<Response<string>>;
  updateUser: (handle: string) => Promise<Response<string>>;
};

const ProfileSection = ({ user, logout, changeUserLevel, updateUser }: ProfileSectionProps) => {
  return (
    <div className="w-full max-w-md">
      <Card>
        <CardContent className="pt-6">
          {user ? (
            <Profile
              user={user}
              logout={logout}
              changeUserLevel={changeUserLevel}
            />
          ) : (
            <Settings updateUser={updateUser} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
