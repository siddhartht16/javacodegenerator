<% if (classObject) { %>

import java.util.*;
import org.springframework.data.repository.CrudRepository;

public interface <%= classObject.repositoryName %> extends CrudRepository<<%= classObject.name %>, Integer> {

}

            <% } %>
