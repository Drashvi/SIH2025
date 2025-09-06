import { motion } from 'framer-motion';
import { 
  IoCloseCircleOutline, 
  IoTimeOutline, 
  IoShieldCheckmarkOutline,
  IoRefreshOutline
} from 'react-icons/io5';
import { SignOutButton } from '@clerk/clerk-react';
import { Button } from '../ui';

interface ApprovalStatusHandlerProps {
  approvalStatus: "pending" | "approved" | "rejected" | undefined;
  userRole: string | undefined;
  userName: string;
}

export default function ApprovalStatusHandler({ 
  approvalStatus, 
  userRole, 
  userName 
}: ApprovalStatusHandlerProps) {
  
  if (approvalStatus === "approved") {
    return null; // User is approved, continue to main app
  }

  const getStatusInfo = () => {
    switch (approvalStatus) {
      case "pending":
        return {
          title: "Account Pending Approval",
          message: `Hi ${userName}! Your ${userRole} account is currently being reviewed by an administrator. You'll receive access once your registration is approved.`,
          icon: IoTimeOutline,
          iconColor: "text-orange-500",
          bgColor: "from-orange-50 to-yellow-50",
          borderColor: "border-orange-200"
        };
      case "rejected":
        return {
          title: "Account Registration Declined",
          message: `Unfortunately, your ${userRole} account registration has been declined. Please contact the administration for more information or to reapply.`,
          icon: IoCloseCircleOutline,
          iconColor: "text-red-500",
          bgColor: "from-red-50 to-pink-50",
          borderColor: "border-red-200"
        };
      default:
        return {
          title: "Account Status Unknown",
          message: "There seems to be an issue with your account status. Please contact support for assistance.",
          icon: IoShieldCheckmarkOutline,
          iconColor: "text-gray-500",
          bgColor: "from-gray-50 to-gray-100",
          borderColor: "border-gray-200"
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-4"
      >
        <div className={`bg-gradient-to-br ${statusInfo.bgColor} rounded-2xl shadow-soft-xl p-8 text-center border ${statusInfo.borderColor}`}>
          {/* Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            className={`w-20 h-20 ${statusInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-2 ${statusInfo.borderColor}`}
          >
            <StatusIcon className={`w-10 h-10 ${statusInfo.iconColor}`} />
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            {statusInfo.title}
          </motion.h1>

          {/* Message */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-700 mb-8 leading-relaxed"
          >
            {statusInfo.message}
          </motion.p>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            {approvalStatus === "pending" && (
              <div className="bg-white/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span>Waiting for administrator approval...</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline" 
                className="flex-1 hover:bg-white/80"
              >
                <IoRefreshOutline className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
              
              <SignOutButton>
                <Button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white">
                  Sign Out
                </Button>
              </SignOutButton>
            </div>

            {/* Contact Information */}
            <div className="mt-6 p-4 bg-white/30 rounded-lg border border-white/50">
              <p className="text-xs text-gray-600 mb-2 font-semibold">Need Help?</p>
              <p className="text-xs text-gray-500">
                Contact your administrator or IT support for assistance with your account approval.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
