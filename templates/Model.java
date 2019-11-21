<% if (classObject) { %>

import java.util.*;

@Entity
<%= classObject.accessModifier %> class <%= classObject.name %> {

    <%= classObject.defaultConstructor %>

    <%= classObject.paramConstructor %>

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    <%= classObject.fields %>

    <%= classObject.relatedFields %>

    <%= classObject.fieldsAccessMethods %>

    <%= classObject.relatedFieldsMethods %>

    <%= classObject.methods %>

}
            <% } %>
