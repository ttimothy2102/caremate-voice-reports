
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AccountManagement } from "@/components/account/AccountManagement";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { CareMateLogoSvg } from "@/components/ui/CareMateLogoSvg";

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onTitleClick?: () => void;
}

export function MobileHeader({ title, showBack, onBack, onTitleClick }: MobileHeaderProps) {
  const [showAccountManagement, setShowAccountManagement] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((name: string) => name[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Default navigation back to dashboard
      navigate('/dashboard');
    }
  };

  const handleTitleClick = () => {
    if (onTitleClick) {
      onTitleClick();
    } else {
      // Default navigation to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div 
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleTitleClick}
            >
              <CareMateLogoSvg width={90} height={24} />
            </div>
            {title !== "CareMate" && (
              <span className="text-sm text-gray-600 ml-2">| {title}</span>
            )}
          </div>
          
          {user && (
            <Avatar 
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowAccountManagement(true)}
            >
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </header>

      <AccountManagement 
        open={showAccountManagement}
        onOpenChange={setShowAccountManagement}
      />
    </>
  );
}
