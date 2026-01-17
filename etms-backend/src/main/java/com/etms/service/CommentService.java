package com.etms.service;

import com.etms.entity.TaskComment;
import java.util.List;

public interface CommentService {

    TaskComment addComment(Long taskId, String email, String comment);

    List<TaskComment> getCommentsForTask(Long taskId, String email, boolean isAdmin);
}
