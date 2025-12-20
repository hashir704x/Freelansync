import CreateMilestoneDialog from "./create-milestone-dialog";

const ProjectDetialsMilestonesComponent = () => {
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Project Milestones
                </h2>

                <CreateMilestoneDialog />
            </div>
        </div>
    );
};

export default ProjectDetialsMilestonesComponent;
