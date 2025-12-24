import type { UserType } from "@/Types";

const DashboardUserCard = ({ user }: { user: UserType }) => {
    return (
        <div className="flex-1 rounded-2xl bg-linear-to-br from-(--my-blue) to-blue-600  shadow-lg flex flex-col items-center text-white justify-center">
            {/* Avatar */}
            <div className="relative">
                <img
                    src={user.profile_pic}
                    alt={user.username}
                    className="w-[150px] h-[150px] rounded-full object-cover border-4 border-white shadow-md mt-6"
                />
            </div>

            {/* User Info */}
            <div className="mt-6 text-center space-y-1">
                <h2 className="text-xl font-semibold tracking-wide">{user.username}</h2>

                <p className="text-sm text-white/80">{user.email}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/20 my-5" />

            {/* Wallet */}
            <div className="flex flex-col items-center gap-1">
                <span className="text-sm uppercase tracking-wide text-white/70">
                    Wallet Balance
                </span>

                <span className="text-2xl font-bold mb-4">${user.wallet_amount}</span>
            </div>
        </div>
    );
};

export default DashboardUserCard;
