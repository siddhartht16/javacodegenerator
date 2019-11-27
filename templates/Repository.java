<% if (classObject) { %>

package <%= classObject.packageName %>.repositories;

import <%= classObject.packageName %>.models.<%= classObject.className %>;
import java.util.*;
import org.springframework.data.repository.CrudRepository;

public interface <%= classObject.repositoryName %> extends CrudRepository<<%= classObject.className %>, Integer> {

    List<<%= classObject.className %>> findAll();
    <%= classObject.className %> findById(int id);
}

            <% } %>
