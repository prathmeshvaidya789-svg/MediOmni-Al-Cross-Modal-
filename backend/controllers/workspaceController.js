import storageService from '../services/storageService.js';

export const createWorkspace = async (req, res) => {
  try {
    const { name, description, domain } = req.body;
    const userId = req.user._id || req.user.id;
    const workspace = await storageService.createWorkspace({
      name,
      description,
      domain: domain || 'Healthcare',
      owner: userId,
    });

    return res.status(201).json({
      success: true,
      workspace,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating workspace.',
    });
  }
};

export const getWorkspaces = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const workspaces = await storageService.getUserWorkspaces(userId);

    return res.status(200).json({
      success: true,
      workspaces,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching workspaces.',
    });
  }
};
