"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { checkAccess } from "@/lib/utils";
import Loader from "@/Components/Common/Loader";
import { LOGIN_ROUTE } from "@/constants/environment";

const withAuthorization = (
  WrappedComponent: React.ComponentType,
  resource: string,
  type: "route" | "component"
) => {
  const WithAuth: React.FC = (props) => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false);

    useEffect(() => {
      if (user && user._id !== "") {
        setIsUserLoaded(true);
      } else {
        setIsUserLoaded(false);
      }
    }, [user]);

    useEffect(() => {
      if (isUserLoaded) {
        if (!user || !user._id) {
          router.replace(LOGIN_ROUTE);
        } else {
          const access = checkAccess(user, resource, type);
          setIsAuthorized(access);

          if (!access) {
            router.replace("/403");
          }
        }
      }
    }, [user, resource, type, router, isUserLoaded]);

    if (!isUserLoaded) {
      return <Loader />;
    }

    if (isAuthorized === null && user && user._id) {
      return <Loader />;
    }

    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  return WithAuth;
};

export default withAuthorization;
