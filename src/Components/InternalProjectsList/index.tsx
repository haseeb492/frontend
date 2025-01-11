import useGetAllInternalProjects from "@/hooks/use-get-all-internal-projects";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularLoader from "../Common/CircularLoader";
import { Modal } from "../Common/Modal";
import AddInternalProjectForm from "../Forms/AddInternalProjectForm";
import { SET_MODAL } from "@/redux/slices/modalSlice";
import InternalProjectDetailsForm from "../Forms/InternalProjectDetailsForm";

interface ProjectDetailFormProps {
  projectId: string;
  name: string;
  description: string;
  roles: string[];
}

interface InternalProjectType {
  _id: string;
  name: string;
  description: string;
  roles: string[] | [];
}

const InternalProjectsList = () => {
  const [selectedProject, setSelectedProject] =
    useState<ProjectDetailFormProps | null>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const isModalOpen = useSelector((state: RootState) => state.modal);

  const { internalProjects, isLoading } = useGetAllInternalProjects(
    user?._id,
    user?._id ? true : false
  );

  const closeTaskModal = () => {
    dispatch(SET_MODAL(false));
    if (selectedProject) {
      setSelectedProject(null);
    }
  };

  const handleTaskUpdateSuccess = () => {
    closeTaskModal();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center my-10">
        <CircularLoader size={40} />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 items-center mt-5">
      {isModalOpen && !selectedProject && (
        <Modal
          title={`Add Project`}
          open={!selectedProject && isModalOpen}
          onOpenChange={closeTaskModal}
          className="bg-white min-w-[600px] min-h[900px]"
        >
          <AddInternalProjectForm />
        </Modal>
      )}

      {selectedProject && isModalOpen && (
        <Modal
          title={`Project Details: ${selectedProject?.name}`}
          open={!!selectedProject && isModalOpen}
          onOpenChange={closeTaskModal}
          className="bg-white min-w-[600px]"
        >
          <InternalProjectDetailsForm
            {...selectedProject}
            onUpdateSuccess={handleTaskUpdateSuccess}
          />
        </Modal>
      )}
      {internalProjects && internalProjects.length > 0 ? (
        internalProjects.map((project: InternalProjectType) => (
          <div
            onClick={() => {
              setSelectedProject({
                projectId: project?._id,
                name: project?.name,
                description: project?.description,
                roles: project?.roles,
              });
              dispatch(SET_MODAL(true));
            }}
            className="flex items-center px-4 py-4 h-auto w-full justify-start border border-gray-300
          shadow-md shadow-gray-400 rounded-[5px] cursor-pointer "
            key={project?._id}
          >
            <h2 className="text-xl text-primary">{project?.name}</h2>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center my-10">
          <span className="text-md text-slate-500">No projects found</span>
        </div>
      )}
    </div>
  );
};

export default InternalProjectsList;
